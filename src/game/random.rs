pub struct Rand {
    seed: u64,
}

impl Rand {
    pub const OUTPUT_BITS: u32 = 48;

    const A: std::num::Wrapping<u64> = std::num::Wrapping(0x5DEECE66Du64);
    const C: std::num::Wrapping<u64> = std::num::Wrapping(0x00000000Bu64);
    const MOD: u64 = 2_u64.pow(Rand::OUTPUT_BITS);

    const LOWER_ORDER_SEED: u16 = 0x330E;

    pub fn new(seed: u64) -> Rand {
        let seed = (seed & 0xFFFFFFFF) << 16 | Self::LOWER_ORDER_SEED as u64;

        Rand { seed }
    }

    pub fn random_zero_or_one(&mut self) -> u64 {
        let x = std::num::Wrapping(self.seed);

        self.seed = (Self::A * x + Self::C).0 % Self::MOD;

        (self.seed >> 16) % 2
    }
}
