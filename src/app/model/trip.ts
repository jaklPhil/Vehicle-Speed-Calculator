export class Trip{
    constructor(
        public airDesity:number,
        //untergrund
        public surface:number,
        public velocity:number,
        public driveResistance:number,
        public wheelPower:number,
        public drivePower:number,
        //in stunden
        public tripTime:number,
        public lenght:number,
        public energie:number,
    ){};
}