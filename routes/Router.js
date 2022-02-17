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
        const $box_title = document.getElementById('box-title-state')
        //const $CONTAINER = document.querySelector('#content-data')
        $box_title.innerHTML=data.name

        const $box_cost = document.getElementById('box-aprox-cost')
        $box_cost.innerHTML=data.cost

        const $box_cost_renovate = document.getElementById('box-cost-renovate')
        $box_cost_renovate.innerHTML=data.cost_total

        const $box_cost_profit = document.getElementById('box-cost-profit')
        $box_cost_profit.innerHTML=data.profit
    }
 
}

// route = (event) => {
//     event = event || window.event
//     console.log(event)
//     event.preventDefault()
//     window.history.pushState({}, '', window.target.href)
//     console.log(window.target.href)

// }