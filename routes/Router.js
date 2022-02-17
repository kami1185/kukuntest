class Router{
    //inicializo el constructor della clase con el objeto Paths 
    //definido en Routes.js
    constructor (paths){
        this.paths = paths
        this.initRouter()
    }

    //al iniciar quiero que la url sea /kukun
    initRouter(){
        const {location:{pathname = '/kukun'}} = window
        //console.log('INIT pathname: ', pathname)
        const URL = pathname === '/kukun' ? 'kukun' : 'kukun'
        // console.log('INIT url',URL)
        this.createUrl(URL)
    }

    //asigno las url por cada estado comparando con el objeto paths
    createUrl(page='kukun'){
        const {paths} = this
        //hago destructure del objetoy obtengo el path de cada estado
        const { [page ]:  path } = paths;
        //selecciono el elemento para cargar los datos de cada estado
        
        //hago el push de la url 
        window.history.pushState({}, '', path)
    }

    templateBoxPanelData(data){

        document.getElementById('box-title-state').innerHTML=data.name
        // $box_title.innerHTML=data.name

        document.getElementById('box-aprox-cost').innerHTML=data.cost

        let $list_remodel = `<li class="k-notifications k-spacing-x1">
                                Kitchen $ <span>${data.kitchen}</span>
                            </li>
                            <li class="k-notifications k-spacing-x1">
                                Bathroom $ <span>${data.bathroom}</span>
                            </li>
                            <li class="k-notifications k-spacing-x1">
                                bedroom <span>${data.bedroom}</span>
                            </li>
                            <li class="k-notifications k-spacing-x1">
                                Living room <span>${data.living_Room}</span>
                            </li>
                            <li class="k-notifications k-spacing-x1">
                                Dining room <span>${data.dining_Room}</span>
                            </li>
                            <li class="k-notifications k-spacing-x1">
                                Master bathroom <span>${data.Master_Bathroom}</span>
                            </li>`

        document.getElementById('box-aprox-cost').innerHTML=$list_remodel

        document.getElementById('box-cost-renovate').innerHTML=data.cost_total
        
        document.getElementById('box-cost-profit').innerHTML=data.profit
        
    }
 
}

// route = (event) => {
//     event = event || window.event
//     console.log(event)
//     event.preventDefault()
//     window.history.pushState({}, '', window.target.href)
//     console.log(window.target.href)

// }