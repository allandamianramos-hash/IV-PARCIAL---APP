"""Development-only, offline translation with Argos Open Tech models.
Run in an isolated environment with ctranslate2, sentencepiece and requests.
Only public/locales/es.json is translated. Never sends website data to a service.
"""
import json, pathlib, zipfile, concurrent.futures, re, time
import requests, ctranslate2, sentencepiece

root=pathlib.Path(__file__).resolve().parents[2]
cache=root/'.runtime'/'translation-models';cache.mkdir(exist_ok=True)
index_file=root/'.runtime/translation-models.json'
if not index_file.exists():
    response=requests.get('https://raw.githubusercontent.com/argosopentech/argospm-index/main/index.json',timeout=30);response.raise_for_status();index_file.write_text(response.text,encoding='utf8')
index=json.loads(index_file.read_text(encoding='utf8'))
langs=['en','de','fr','it','pt','ja','ko','zh','ar']
packages=[next(p for p in index if p['from_code']==('es' if lang=='en' else 'en') and p['to_code']==lang) for lang in langs]
def download(p):
    name=p['from_code']+'_'+p['to_code'];folder=cache/name
    if not folder.exists():
        print('Downloading model '+name,flush=True)
        r=requests.get(p['links'][0],timeout=180);r.raise_for_status()
        archive=cache/(name+'.zip');archive.write_bytes(r.content)
        with zipfile.ZipFile(archive) as z:
            for item in z.infolist():
                target=(folder/item.filename).resolve()
                if not target.is_relative_to(folder.resolve()):raise ValueError('Unsafe archive path')
            z.extractall(folder)
        archive.unlink()
    return name,next(folder.rglob('model.bin')).parent
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:models=dict(ex.map(download,packages))
source=json.loads((root/'public/locales/es.json').read_text(encoding='utf8'))
reviewed=json.loads((root/'.runtime/i18n-reviewed.json').read_text(encoding='utf8'))
reviewed['en'].update(json.loads((root/'scripts/i18n/reviewed-en.json').read_text(encoding='utf8')))
def translate(lang,base,invalidate=()):
    destination=root/'public/locales'/f'{lang}.json'
    done=json.loads(destination.read_text(encoding='utf8')) if destination.exists() else {}
    for key in invalidate:done.pop(key,None)
    done.update(reviewed.get(lang,{}))
    model=models[('es' if lang=='en' else 'en')+'_'+lang]
    if (model.parent/'sentencepiece.model').exists():
        tokenizer=sentencepiece.SentencePieceProcessor(model_file=str(model.parent/'sentencepiece.model'))
        encode=lambda s:tokenizer.encode(s,out_type=str)
        # Argos models retain word-boundary markers after SentencePiece decoding.
        decode=lambda tokens:tokenizer.decode(tokens).replace('▁',' ').replace('_',' ')
    else:
        from sacremoses import MosesTokenizer, MosesDetokenizer, MosesPunctNormalizer
        from subword_nmt.apply_bpe import BPE
        src='es' if lang=='en' else 'en'
        mt=MosesTokenizer(src);md=MosesDetokenizer(lang);normalizer=MosesPunctNormalizer(src)
        with (model.parent/'bpe.model').open(encoding='utf8') as f:bpe=BPE(f)
        encode=lambda s:bpe.segment_tokens(mt.tokenize(normalizer.normalize(s)))
        decode=lambda tokens:md.detokenize(' '.join(tokens).replace('@@ ','').split(' '))
    engine=ctranslate2.Translator(str(model),device='cpu',compute_type='float32',inter_threads=1,intra_threads=4)
    missing=[key for key in source if key not in done]
    def batch(strings):
        tokens=[encode(s) for s in strings]
        results=engine.translate_batch(tokens,beam_size=1,max_batch_size=32,max_decoding_length=min(192,max(24,max(map(len,tokens))*2)),repetition_penalty=1.15)
        return [decode(r.hypotheses[0]) for r in results]
    for start in range(0,len(missing),32):
        keys=missing[start:start+32]
        inputs=[base.get(key,key) for key in keys]
        # Preserve interpolation fields, never translate values such as names or prices.
        encoded=[re.sub(r'\{(\w+)\}',lambda m:'ZXQ'+m[1]+'ZXQ',s) for s in inputs]
        outputs=batch(encoded)
        for key,value,out in zip(keys,inputs,outputs):
            out=re.sub(r'ZXQ\s*(\w+?)\s*ZXQ',lambda m:'{'+m[1]+'}',out,flags=re.I)
            fields=re.findall(r'\{\w+\}',value)
            if sorted(fields)!=sorted(re.findall(r'\{\w+\}',out)) or re.search('ZXQ',out,re.I):
                chunks=re.split(r'(\{\w+\})',value)
                translated=iter(batch([c for c in chunks if c.strip() and not re.fullmatch(r'\{\w+\}',c)]))
                out=''.join(c if not c.strip() or re.fullmatch(r'\{\w+\}',c) else (' ' if c.startswith(' ') else '')+next(translated).strip()+(' ' if c.endswith(' ') else '') for c in chunks)
            done[key]=out.strip() or value
        payload=json.dumps({k:done[k] for k in source if k in done},ensure_ascii=False,indent=2)+'\n'
        temporary=destination.with_suffix('.tmp')
        for attempt in range(10):
            try:
                temporary.write_text(payload,encoding='utf8');temporary.replace(destination);break
            except OSError:
                if attempt==9:raise
                time.sleep(0.3*(attempt+1))
        print(f'{lang}: {min(start+32,len(missing))}/{len(missing)}',flush=True)
    # Reviewed edits and removed source messages must be saved even when there
    # are no new messages to translate.
    payload=json.dumps({k:done[k] for k in source},ensure_ascii=False,indent=2)+'\n'
    temporary=destination.with_suffix('.tmp')
    for attempt in range(10):
        try:
            temporary.write_text(payload,encoding='utf8');temporary.replace(destination);break
        except OSError:
            if attempt==9:raise
            time.sleep(0.3*(attempt+1))
    return done
previous_english=json.loads((root/'public/locales/en.json').read_text(encoding='utf8')) if (root/'public/locales/en.json').exists() else {}
english=translate('en',source)
changed=[key for key in source if previous_english.get(key)!=english.get(key)]
for lang in langs[1:]:translate(lang,english,changed)
