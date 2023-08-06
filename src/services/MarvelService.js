class MarvelService{

    _apiKey='apikey=cefbc1dca21f01edb0038ca1a92f962f'
    _apiBaseLink='https://gateway.marvel.com:443/v1/public/'

    getResource= async(url)=>{
        let res= await fetch(url)
        if(!res.ok){
            throw new Error(`Could not fetch${url}, status ${res.status}`)
        }
        return await res.json()
    }

    getAllCharacters=async()=>{
        const res= this.getResource( ` ${this._apiBaseLink}characters?limit=9&offset=${this._apiKey} `).then(console.log('sdf'))
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter= async(id)=>{
        const res= await this.getResource(`${this._apiBaseLink}characters/${id}?${this._apiKey}`)
        console.log(res)
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter=(char)=>{
        return{
            name:char.description,
            description:char.description,
            thumbnail:char.path+'.'+char.extension,
            homepage:char.urls[0],
            wiki:char.urls[1]
        }
    }
}
export default MarvelService