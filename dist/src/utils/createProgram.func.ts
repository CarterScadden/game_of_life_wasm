export default function createProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string
): WebGLProgram {
    const fShader = createShader(
        gl,
        fragmentSource,
        gl.FRAGMENT_SHADER,
        "Fragment"
    );
    const vShader = createShader(gl, vertexSource, gl.VERTEX_SHADER, "Vertex");

    const program = gl.createProgram();

    gl.attachShader(program, fShader);
    gl.attachShader(program, vShader);

    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(
            `Error validating program, ${gl.getProgramInfoLog(program)}`
        );
    }

    return program;
}

function createShader(
    gl: WebGL2RenderingContext,
    source: string,
    glShader: number,
    label: string
): WebGLShader {
    const shader = gl.createShader(glShader);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(
            `Error compiling ${label} shader, ${gl.getShaderInfoLog(shader)}`
        );
    }

    return shader;
}
