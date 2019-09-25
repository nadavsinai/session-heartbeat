export interface ISessionTransport {
  clientId: string;
  dispatchAction(action: any): void;

  addEventListener(onMessage: (action: any) => void): void;

  getPlayerID(): Promise<any>;
}

export class HeartBeatSessionAction {
  readonly type = "HEARTBEAT";

  constructor(public hasBeenActive: boolean) {

  }
}


export class SessionTransportMock implements ISessionTransport {


  createMockEvent: (action: any) => void;
  private playerID: Promise<any> = Promise.resolve('testID');

  constructor(public clientId: string) {
    // here we're expected to work with the physical transport (eg. websocket) and resolve the playerID promise with the PlayerID once conncted and
    // the server assigned us with a playerID;
  }

  dispatchAction(event: any): void {
    const playerID = 'testID';
    event.playerID = playerID;
    console.log(event);
  }

  addEventListener(onMessage: (action: any) => void): void {
    this.createMockEvent = onMessage;
  }

  public getPlayerID(): Promise<any> {
    return this.playerID;
  }
}
