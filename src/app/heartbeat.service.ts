
import { interval, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ISessionTransport, HeartBeatSessionAction } from './shared.interfaces';
import { fromEvent,Subscription, merge,timer,race,OperatorFunction } from "rxjs";
import { FromEventTarget } from "rxjs/internal/observable/fromEvent";
import { bufferTime,throttle,mergeMap,take,sample,repeat,switchMap,defaultIfEmpty,takeUntil,startWith ,withLatestFrom,filter, mapTo } from "rxjs/operators";


export function heartbeat(intervalInSeconds: number): OperatorFunction<any, HeartBeatSessionAction> {

	const intervalInMs = intervalInSeconds * 1000;
	const timer$ = interval(intervalInMs);
	return (activityMarker: Observable<any>) => activityMarker
		.pipe(
			takeUntil(timer$),
			take(1),
			mapTo(true as boolean),
			defaultIfEmpty(false as boolean),
			repeat(),
			sample(timer$),
			map((activeInFrame) => new HeartBeatSessionAction(activeInFrame))
		);
}


export class BrowserActivityHeartbeatService {
	constructor(private heartBeatInSeconds: number, private transport: ISessionTransport) {

	}

startWatcher(eventTarget: FromEventTarget<MouseEvent | KeyboardEvent>) {
		const mouseMoves$ = fromEvent(eventTarget, 'mousemove');
		const keyboardClicks$ = fromEvent(eventTarget, 'keydown');
		const scrollEvents$ = fromEvent(eventTarget, 'scroll');
		const mergedUIEvents = merge(mouseMoves$, keyboardClicks$, scrollEvents$);
		return mergedUIEvents.pipe(heartbeat(this.heartBeatInSeconds));
	}

	windowHeartBeatToTransport(eventTarget = window): Subscription {
		return this.startWatcher(eventTarget).subscribe((heatBeatMessage) => {
			this.transport.dispatchAction(heatBeatMessage);
		});
	}
}
