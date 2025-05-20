export function constrain(min: number, value: number, max: number): number{
    if(value > max){
        return max
    } else if(value < min) {
        return min
    } else {
        return value
    }
}

export function inches_to_hundreths(inches: number): number {
    return Math.round(inches * 100)
}

export function hundreths_to_inches(hundreths: number): number {
    return hundreths/100
}