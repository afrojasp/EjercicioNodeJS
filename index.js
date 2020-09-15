const axios = require('axios');
const fs = require('fs');
const http = require('http');
const parse = require('node-html-parser');
const url = require('url');

var proveedores = [];
var clientes = [];

async function obtenerDatosProveedores(){
    let response = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json')
    return response.data;
}

async function obtenerDatosClientes(){
    let response = await axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json')
    return response.data;
}

http.createServer( async (req, res) => {
    let q = url.parse(req.url, true);
    let adr = q.pathname;
    if(adr === '/api/proveedores'){
        proveedores = await obtenerDatosProveedores();
        fs.readFile('proveedores.html' , (err, html) => {
            if(err){
                throw err;
            }

            let root = parse.parse(html);
            let tProveedores = root.querySelector('body').querySelector('table').querySelector('#tbody-proveedores');
            proveedores.forEach(element => {
                tProveedores.insertAdjacentHTML('beforebegin','<tr><td>'+ element.idproveedor + '</td><td>' + element.nombrecompania + '</td><td>' + element.nombrecontacto +'</td></tr>')
            });
            
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(root.toString());
            return res.end();
        })
    }
    else if(adr === '/api/clientes'){
        clientes = await obtenerDatosClientes();
        fs.readFile('clientes.html' , (err, html) => {
            if(err){
                throw err;
            }

            let root = parse.parse(html);
            let tClientes = root.querySelector('body').querySelector('table').querySelector('#tbody-clientes');
            clientes.forEach(element => {
                tClientes.insertAdjacentHTML('beforebegin','<tr><td>'+ element.idCliente + '</td><td>' + element.NombreCompania + '</td><td>' + element.NombreContacto +'</td></tr>')
            });
            
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write(root.toString());
            return res.end();
        })
    }
    
    
}).listen(8081 , () => {
    console.log('Se esta escuchando en: el puerto 8081' )
});

