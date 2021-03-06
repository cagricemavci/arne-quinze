function fetchLocalData() {
    this.pressData = async (callback) => {
        console.log('fetch is initiated')
        let response = await fetch('data/press.json');
        let data = await response.json();
        return await callback(data);
    }

    this.artData = async (callback) => {
        console.log('fetch is initiated')
        let response = await fetch('data/art.json');
        let data = await response.json();
        return await callback(data);
    }

    this.atelierData = async (callback) => {
        console.log('fetch is initiated')
        let response = await fetch('data/atelier.json');
        let data = await response.json();
        return await callback(data);
    }
}
