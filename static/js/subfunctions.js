function fetchLocalData() {
    this.pressData = async (callback) =>  {
        console.log('fetch is initiated')
        let response = await fetch('data/press.json');
        let data = await response.json();
        return await callback(data);
    }
}