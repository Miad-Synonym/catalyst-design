"""Bounded, resumable generation using ONLY the supplied Catalyst credential.

Run with the dedicated Python environment containing fal-client/imageio-ffmpeg.
Never resubmits a saved request. No retry after an uncertain submission.
"""
import concurrent.futures, datetime, json, pathlib, subprocess, sys, time, urllib.request
import fal_client
import imageio_ffmpeg

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / '.runtime/jobs'
import os
key = os.environ.get('FAL_KEY', '')
if not key and (ROOT / '.env.catalyst.local').exists():
    for line in (ROOT / '.env.catalyst.local').read_text().splitlines():
        if line.startswith('FAL_KEY='):
            key = line.split('=', 1)[1].strip().strip(chr(34)+chr(39))
client = fal_client.SyncClient(key=key) if key else None
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

def save(name, value):
    (OUT / name).write_text(json.dumps(value, indent=2))

def job(name, endpoint, params):
    result_file = OUT / (name + '-result.json')
    if result_file.exists():
        return json.loads(result_file.read_text())
    request_file = OUT / (name + '-request.json')
    timing_file = OUT / (name + '-timing.json')
    if request_file.exists():
        request = json.loads(request_file.read_text())
        handle = client.get_handle(endpoint, request['request_id'])
        timing = json.loads(timing_file.read_text())
    else:
        marker = OUT / (name + '-submission-started.json')
        if marker.exists():
            raise RuntimeError('Uncertain submission; inspect saved record before any retry: ' + name)
        timing = {'submitted_epoch': time.time(), 'submitted_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'poll_interval_seconds': 5, 'first_processing_seconds': None}
        save(name + '-input.json', {'endpoint': endpoint, 'input': params, 'credential_source': 'Catalyst supplied project key'})
        save(name + '-timing.json', timing)
        save(name + '-submission-started.json', {'started': timing['submitted_utc']})
        handle = client.submit(endpoint, arguments=params)
        save(name + '-request.json', {'endpoint': endpoint, 'request_id': handle.request_id})
        print(name + ': submitted ' + handle.request_id, flush=True)
    last = None
    for _ in range(240):
        status = handle.status()
        kind = type(status).__name__
        elapsed = round(time.time() - timing['submitted_epoch'], 1)
        if kind == 'InProgress' and timing['first_processing_seconds'] is None:
            timing['first_processing_seconds'] = elapsed
            save(name + '-timing.json', timing)
        if kind != last:
            print(name + ': ' + kind + ' (' + str(elapsed) + 's)', flush=True)
            last = kind
        if kind == 'Completed':
            result = handle.get()
            timing['result_retrieved_seconds'] = round(time.time() - timing['submitted_epoch'], 1)
            save(name + '-result.json', result)
            save(name + '-timing.json', timing)
            print(name + ': complete in ' + str(timing['result_retrieved_seconds']) + 's', flush=True)
            return result
        time.sleep(5)
    raise RuntimeError('Pending job saved for resume: ' + name)

def download(url, name):
    target = OUT / name
    if not target.exists():
        urllib.request.urlretrieve(url, target)
    return target
