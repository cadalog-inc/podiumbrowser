class License {
    constructor(fingerprint, id, key, checkin) {
        this.fingerprint = fingerprint;
        this.id = id;
        this.key = key;
        this.checkin = checkin;
    }

    updateCheckin(value) {
        this.checkin = value;
        License.setLicense(this);
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
            return null;
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