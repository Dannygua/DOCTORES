export function getData(endPoint:string){
    let headers = localStorage.getItem("token") !== undefined ?
    {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
    }
    :
    {
        'Content-Type': 'application/json'
    }
    const options:any = {
        method: 'GET',
        headers
    }
   
    const request = fetch(`${process.env.REACT_APP_API_URL}/${endPoint}`, options)
    const json = request.then(response => response.json())
    return json;
}