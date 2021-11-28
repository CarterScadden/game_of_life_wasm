import { Universe } from "../../../pkg/game_of_life";
import Grid from "../utils/Grid.class";

export default class Game {
    public readonly grid: Grid;
    public readonly universe: Universe;

    public get width(): number {
        return this.grid.width;
    }

    public get size(): number {
        return this.grid.size;
    }

    public constructor(width: number) {
        this.grid = new Grid(width);
        this.universe = Universe.new(this.grid.width, this.seed());
    }

    public seed(): BigInt {
        return BigInt(Math.floor(Math.random() * 80000));
    }

    public resize(width: number): void {
        this.grid.resize(width);
        this.universe.resize(width);
    }
}
