import type Display from "./Display.class";
import type Game from "./Game.class";

export default class Renderer {
    private _delay: number;
    private _frame: number;
    private _runningState: RendererState;
    private _previousTimeStamp: number | null;

    public constructor(frameRate: number) {
        this._delay = 1000 / frameRate;
        this._frame = -1;
        this._previousTimeStamp = null;
        this._runningState = RendererState.RUNNING;
    }

    public animate(game: Game, display: Display): void {
        const loop = (timestamp: number): void => {
            switch (this._runningState) {
                case RendererState.PAUSED:
                    break;

                case RendererState.RUNNING:
                    this._run(timestamp, game, display);
                    break;
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    private _run(timestamp: number, game: Game, display: Display): void {
        if (this._previousTimeStamp == null) {
            this._previousTimeStamp = timestamp;
        }

        const currentFrame = Math.floor(
            (timestamp - this._previousTimeStamp) / this._delay
        );

        if (currentFrame > this._frame) {
            this._frame = currentFrame;

            game.universe.update();
            display.render(game);
        }
    }

    public toggleState(): void {
        switch (this._runningState) {
            case RendererState.PAUSED:
                this._runningState = RendererState.RUNNING;
                break;
            case RendererState.RUNNING:
                this._runningState = RendererState.PAUSED;
                break;
        }
    }
}

enum RendererState {
    RUNNING,
    PAUSED,
}
