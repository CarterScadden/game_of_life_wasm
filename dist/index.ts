import Renderer from "./src/core/Renderer.class";
import Display from "./src/core/Display.class";
import Game from "./src/core/Game.class";
import Gui from "./src/core/Gui.class";
import { memory } from "../pkg/game_of_life_bg.wasm";

main();

function main(): void {
    const gui = new Gui();
    const game = new Game(64);
    const display = new Display(game, gui, memory);
    const renderer = new Renderer(8);

    gui.addEvents(renderer, game, display);

    renderer.animate(game, display);
}
