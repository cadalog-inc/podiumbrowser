import axios from 'axios';

class License {
    constructor(fingerprint, id, key, checkin) {
        this.fingerprint = fingerprint;
        this.id = id;
        this.key = key;
        this.checkin = checkin;
    }
    
    static create_UUID = () => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
    
    static isUUID = ( uuid ) => {
        let s = "" + uuid;
    
        s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        if (s === null) {
          return false;
        }
        return true;
    }

    days() {
        return Math.round(Math.abs(new Date(this.checkin) - Date.now()) / 8.64e7);
    }

    activate(key, callback, fallback = () => {}) {
        axios.get(`https://v4.pdm-plants-textures.com/activate.php?key=${key}&fingerprint=${License.create_UUID()}`)
        .then((response) => {
            if(response.status === 200 && response.data.statusCode === 201) {
                this.key = response.data.key;
                this.fingerprint = response.data.fingerprint;
                this.id = response.data.id;
                const expiry = response.data.expiry;
                if(expiry.year) {
                    this.checkin = new Date(expiry.year, expiry.month-1, expiry.day).toLocaleDateString();
                } else {
                    const nd = new Date();
                    nd.setMonth(nd.getMonth() + 1);
                    this.checkin = nd.toLocaleDateString();
                }
                // todo: set expiry if not already set
                License.setLicense(this);
                callback(this);
            } else {
                console.log(JSON.stringify(response));
                fallback(response.data.body);
            }
        })
        .catch((e) => {
            fallback(e);
        });
    }

    validate(callback, fallback = () => {}) {
        axios.get(`https://v4.pdm-plants-textures.com/validate.php?key=${this.key}&fingerprint=${this.fingerprint}`)
        .then((response) => {
            if(response.status === 200 && response.data.statusCode === 200) {
                const expiry = response.data.expiry;
                if(expiry.year) {
                    this.checkin = new Date(expiry.year, expiry.month-1, expiry.day).toLocaleDateString();
                } else {
                    const nd = new Date();
                    nd.setMonth(nd.getMonth() + 1);
                    this.checkin = nd.toLocaleDateString();
                }
                License.setLicense(this);
                callback(this, response.data.valid);
            } else {
                fallback();
            }
        })
        .catch(() => {
            fallback()
        });
    }

    deactivate(callback, fallback = () => {}) {
        axios.get(`https://v4.pdm-plants-textures.com/deactivate.php?machineId=${this.id}`)
        .then((response) => {
            if(response.status === 200) {
                this.fingerprint = "";
                this.id = "";
                this.key = "";
                this.checkin = "";
                License.setLicense(this);
                callback(this);
            } else {
                fallback("Deactivation failed.");
            }
        })
        .catch(() => {
            fallback()
        });
    }

    static isValid(license) {
        
        return (
            (license.checkin === "" || license.checkin === undefined || license.checkin === null) ? 
            false : 
            new Date() <= new Date(license.checkin)
        );
    }

    static getLicense() {
        try {
            const licenseEncoded = localStorage.getItem("PodiumBrowserStandaloneLicense") || "";
            const licenseDecoded = atob(licenseEncoded);
            const license = JSON.parse(licenseDecoded);

            return new License(
                license.fingerprint,
                license.id,
                license.key,
                license.checkin
            );

        } catch (e) {
            console.log(e);
            return new License("", "", "", "");
        }
    }

    static setLicense(license) {
        try {
            localStorage.setItem("PodiumBrowserStandaloneLicense", btoa(JSON.stringify(license)));
        } catch(e) {
            console.log(e);
        }
    }
}

export default License;