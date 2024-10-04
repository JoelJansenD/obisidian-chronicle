import { Plugin } from 'obsidian';

export default class ChroniclePlugin extends Plugin {

    onload(): Promise<void> | void {
        console.log('test')
    }

};