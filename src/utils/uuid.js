export class Utils {
    static create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    static temp_ID(items) {
        const l = items.length;
        let id = l;
        for(let i = 0; i < l; i++) {
            const item = items[i];
            if(item.id > id) {
                id = item.id;
            }
        }
        return id + 1;
    }
}
