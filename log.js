export function log(arg){
    const time = new Date();
    console.log(time.toLocaleString(), ...arguments);
}