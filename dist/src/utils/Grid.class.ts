export default class Grid {
    public size: number;
    private grid: GridItem[];
    public width: number;

    public constructor(width: number) {
        this.resize(width);
    }

    public get(index: number): GridItem | null {
        return this.grid[index] || null;
    }

    public resize(width: number): void {
        this.width = width;
        this.size = this.width * this.width;

        const grid = [];

        let row = -1;
        let col = -1;

        for (let i = 0; i < this.size; i++) {
            if (i % this.width === 0) {
                row++;
                col = -1;
            }

            col++;

            grid[i] = {
                row,
                col,
                index: i,
                left: null,
                right: null,
                top: null,
                bottom: null,
            };

            for (let i = 0; i < grid.length; i++) {
                grid[i].left = grid[i - 1] || null;
                grid[i].right = grid[i + 1] || null;
                grid[i].top = grid[i - this.width] || null;
                grid[i].bottom = grid[i + this.width] || null;
            }
        }
        this.grid = grid;
    }
}

type GridItem = {
    readonly row: number;
    readonly col: number;
    readonly index: number;
    readonly top: GridItem | null;
    readonly right: GridItem | null;
    readonly bottom: GridItem | null;
    readonly left: GridItem | null;
};
