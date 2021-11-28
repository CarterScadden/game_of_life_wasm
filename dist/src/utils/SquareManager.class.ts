import createProgram from "./createProgram.func";
import fragmentShaderSource from "../shaders/fragment/game_of_life.frag";
import vertexShaderSource from "../shaders/vertex/game_of_life.vert";
import Color from "./Color.interface";

let _id_iter = 0;

export default class SquareManager {
    private _squares: Square[] = [];
    private _program: WebGLProgram;
    private a_position: number;
    private a_color: number;
    private sliceAmount: number;

    public constructor(gl: WebGL2RenderingContext) {
        this._program = createProgram(
            gl,
            vertexShaderSource,
            fragmentShaderSource
        );

        this.a_position = gl.getAttribLocation(this._program, "a_position");
        this.a_color = gl.getAttribLocation(this._program, "a_color");
        this.sliceAmount = 6 * Float32Array.BYTES_PER_ELEMENT;
    }

    public addSquare(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: Color
    ): number {
        const sq = new Square(x1, y1, x2, y2, color);
        this._squares.push(sq);

        return sq.id;
    }

    public deleteSquare(id: number): void {
        this._squares = this._squares.filter((sq) => sq.id === id);
    }

    public draw(gl: WebGL2RenderingContext): void {
        const data = new Float32Array(
            this._squares.map((sq) => sq.value).flat()
        );

        const buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        gl.vertexAttribPointer(
            this.a_position,
            2, // elements per attrib
            gl.FLOAT, // type of elements
            false,
            this.sliceAmount, // (2 for a_position, and 4 for a_color)
            0 // offset
        );

        gl.vertexAttribPointer(
            this.a_color,
            4,
            gl.FLOAT,
            false,
            this.sliceAmount,
            2 * Float32Array.BYTES_PER_ELEMENT // skip position
        );

        gl.enableVertexAttribArray(this.a_position);
        gl.enableVertexAttribArray(this.a_color);

        gl.useProgram(this._program);
        gl.drawArrays(gl.TRIANGLES, 0, this._squares.length * Square.size);
    }

    public clear(): void {
        this._squares = [];
    }
}

class Square {
    private _id: number;
    private _value: number[];
    static readonly size = 36;

    public constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: Color
    ) {
        this._id = _id_iter++;
        this._value = [
            x1,
            y1,
            color.r,
            color.g,
            color.b,
            color.a,
            x1,
            y2,
            color.r,
            color.g,
            color.b,
            color.a,
            x2,
            y1,
            color.r,
            color.g,
            color.b,
            color.a,
            x2,
            y1,
            color.r,
            color.g,
            color.b,
            color.a,
            x2,
            y2,
            color.r,
            color.g,
            color.b,
            color.a,
            x1,
            y2,
            color.r,
            color.g,
            color.b,
            color.a,
        ];

        if (this._value.length !== Square.size) {
            throw new Error(
                `Square is too big ${JSON.stringify(this.value, null, 2)}`
            );
        }
    }

    public get id(): number {
        return this._id;
    }

    public get value(): number[] {
        return this._value;
    }
}
