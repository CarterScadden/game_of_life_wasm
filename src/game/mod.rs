mod random;

use crate::utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    cells: Vec<Cell>,
    rand: random::Rand,
}

#[wasm_bindgen]
impl Universe {
    pub fn new(width: u32, seed: u64) -> Universe {
        let mut rand = random::Rand::new(seed);
        let cells = new_board(width, &mut rand);

        Universe { width, rand, cells }
    }

    pub fn restart(&mut self, seed: u64) {
        self.rand = random::Rand::new(seed);
        self.cells = new_board(self.width, &mut self.rand)
    }

    pub fn resize(&mut self, width: u32) {
        self.width = width;

        let mut cells = vec![];

        for row in 0..self.width {
            for col in 0..self.width {
                let index = self.get_index(row, col);

                match self.get_cell(index) {
                    Some(cell) => cells[index] = *cell,
                    None => {
                        cells[index] = if self.rand.random_zero_or_one() == 0 {
                            Cell::Dead
                        } else {
                            Cell::Alive
                        }
                    }
                }
            }
        }

        self.cells = cells;
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn update(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.width {
            for col in 0..self.width {
                let index = self.get_index(row, col);
                let living_neighbors = self.get_total_neighbors_alive(row, col);

                let cell_option = self.get_cell(index);

                match cell_option {
                    Some(cell) => {
                        let new_living_state = match (*cell, living_neighbors) {
                            (Cell::Alive, living_neighbors) if living_neighbors < 2 => Cell::Dead,
                            (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                            (Cell::Alive, living_neighbors) if living_neighbors > 3 => Cell::Dead,
                            (Cell::Dead, 3) => Cell::Alive,
                            (current, _) => current,
                        };

                        next[index] = new_living_state;
                    }
                    None => {}
                }
            }
        }

        self.cells = next;
    }

    pub fn get_cells_ptr(&self) -> *const Cell {
        self.cells.as_ptr()
    }
}

impl Universe {
    pub fn get_cells(&self) -> &[Cell] {
        &self.cells
    }

    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let index = self.get_index(row, col);
            self.cells[index] = Cell::Alive;
        }
    }

    fn get_index(&self, row: u32, col: u32) -> usize {
        let index = row * self.width + col;

        index as usize
    }

    fn get_cell(&self, index: usize) -> Option<&Cell> {
        self.cells.get(index)
    }

    fn get_total_neighbors_alive(&self, row: u32, col: u32) -> u8 {
        let mut total: u8 = 0;

        for i_row in [self.width - 1, 0, 1].iter().cloned() {
            for j_col in [self.width - 1, 0, 1].iter().cloned() {
                if i_row == 0 && j_col == 0 {
                    continue;
                }

                let neighbouring_row = (row + i_row) % self.width;
                let neighbouring_col = (col + j_col) % self.width;

                match self.get_cell(self.get_index(neighbouring_row, neighbouring_col)) {
                    Some(cell) => total += *cell as u8,
                    None => {}
                }
            }
        }

        total
    }
}

fn new_board(width: u32, rand: &mut random::Rand) -> Vec<Cell> {
    set_panic_hook();

    let cells: Vec<Cell> = (0..(width * width))
        .map(|_| {
            if rand.random_zero_or_one() == 0 {
                Cell::Dead
            } else {
                Cell::Alive
            }
        })
        .collect();

    cells
}

impl std::fmt::Display for Universe {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        // chunk cells into slices of slices where every slice[n] is self.width long
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == Cell::Dead { 'o' } else { 'x' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
