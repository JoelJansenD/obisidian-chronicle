export class Plugin {
    constructor() {}
    onload() {}
    onunload() {}
    app: any = {
        workspace: {
            on() {},
            off() {}
        }
    };
}
