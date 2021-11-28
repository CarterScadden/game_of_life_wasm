import { CANVAS_ID, CONTROLLER_ID, CANVAS_CONTAINER } from "../constants";
import Display from "./Display.class";
import Game from "./Game.class";
import Renderer from "./Renderer.class";

export default class Gui {
    public canvasContainer: HTMLDivElement;
    public canvas: HTMLCanvasElement;
    public controller: HTMLUListElement;

    public constructor() {
        // add controller
        // body.flex
        // -> id: "Gui-Container"
        //  flex
        //  width: 300px
        //

        this.canvasContainer = document.getElementById(
            CANVAS_CONTAINER
        ) as HTMLDivElement;

        this.canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;

        this.controller = document.getElementById(
            CONTROLLER_ID
        ) as HTMLUListElement;

        if (!this.canvasContainer) {
            throw new Error(`no div.id: "${CONTROLLER_ID}"`);
        }

        if (!this.canvas) {
            throw new Error(
                `no canvas.id (that is child of #${CONTROLLER_ID}): "${CANVAS_ID}"`
            );
        }

        if (!this.controller) {
            throw new Error(`no div.id: "${CONTROLLER_ID}"`);
        }
    }

    public addEvents(renderer: Renderer, game: Game, display: Display): void {
        document.body.onresize = (): void => this.onresize(display);

        document.body.onclick = function (): void {
            renderer.toggleState();
        };

        document.body.onkeydown = function ({ key }): void {
            if (key === " ") {
                game.universe.restart(
                    BigInt(Math.floor(Math.random() * 80000))
                );
            }
        };

        this.onresize(display);
    }

    public onresize(display: Display): void {
        const { offsetWidth, offsetHeight } = this.canvasContainer;

        const width = ((): number => {
            if (offsetWidth > offsetHeight) {
                return offsetHeight;
            } else {
                return offsetWidth;
            }
        })();

        this.canvas.width = width;
        this.canvas.height = width;
        display.resizeViewport(width);
    }
}
