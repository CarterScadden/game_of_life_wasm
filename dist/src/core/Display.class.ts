import SquareManager from "../utils/SquareManager.class";
import Game from "./Game.class";
import { Cell } from "../../../pkg/game_of_life";
import Gui from "./Gui.class";

export default class Display {
    private _gl: WebGL2RenderingContext;

    private _cells: SquareManager;
    private _config: DisplayConfig;
    private _memory: WebAssembly.Memory;

    public constructor(game: Game, gui: Gui, memory: WebAssembly.Memory) {
        this._memory = memory;
        this._initializeWebGL(gui);

        this._cells = new SquareManager(this._gl);

        this.resize(game);
    }

    public resize(game: Game): void {
        const baseTileSize = 2 / game.width;

        this._config = {
            baseTileSize: baseTileSize,
            tileSize: baseTileSize * 0.98,
            offset: baseTileSize * 0.02,
        };
    }

    public resizeViewport(width: number): void {
        this._gl.viewport(0, 0, width, width);
    }

    public render(game: Game): void {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT || this._gl.DEPTH_BUFFER_BIT);

        this._cells.clear();

        const cells = new Uint8Array(
            this._memory.buffer,
            game.universe.get_cells_ptr(),
            game.size
        );

        for (let i = 0; i < game.size; i++) {
            const { col, row } = game.grid.get(i);

            if (cells[i] === Cell.Alive) {
                const x =
                    this._config.baseTileSize * col + this._config.offset - 1;
                const y =
                    this._config.baseTileSize * row + this._config.offset - 1;

                this._cells.addSquare(
                    x,
                    y,
                    x + this._config.tileSize,
                    y + this._config.tileSize,
                    {
                        r: 0,
                        g: 0.6,
                        b: 0.6,
                        a: 1.0,
                    }
                );
            }
        }

        this._cells.draw(this._gl);
    }

    private _initializeWebGL(gui: Gui): void {
        const gl = gui.canvas.getContext("webgl2");

        if (!gl) {
            throw new Error("Webgl2 not supported, unable to render");
        }

        this._gl = gl;
        this._gl.clearColor(0.25, 0.25, 0.25, 1);
    }
}

interface DisplayConfig {
    baseTileSize: number;
    tileSize: number;
    offset: number;
}
