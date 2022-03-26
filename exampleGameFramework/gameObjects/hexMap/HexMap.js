import HexMapDataClass from "./HexmapData"
import HexMapBuilderClass from "./HexmapBuilder"
import HexMapControllerClass from "./HexmapController"
import HexMapViewClass from "./HexMapView"

export default class HexMapClass {

    constructor(ctx, x, y, size, squish){
        this.data = new HexMapDataClass(x, y, size, squish);
        this.builder = new HexMapBuilderClass(this.data);
        this.controller = new HexMapControllerClass(this.data);
        this.view = new HexMapViewClass(ctx, this.data);
    }

}