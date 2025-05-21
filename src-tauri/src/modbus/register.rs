enum Register {
    Hreg(Hreg),
    Coil(Coil),
}

struct Hreg {
    name: String,
    value: u16,
}

struct Coil {
    name: String,
    value: bool,
}
