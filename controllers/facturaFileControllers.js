const fs =  require('fs')

//validar si el archivo existe
// \n


function facturaFile(fecha = '11/12/2022', numeroControl = '00-00000173', numFactura = '00000153', razonSocial, cidRif ='v-12174610', direccion, telefono, descripcion, detalleDePago) {
 
    const nombreArchivo = 'prueba.txt'
    const contenido = 
`<html>

<table class="default">

  <tr>

    <td>Celda 1</td>

    <td>Celda 2</td>

    <td>Celda 3</td>

  </tr>

  <tr>

    <td>Celda 4</td>

    <td>Celda 5</td>

    <td>Celda 6</td>

  </tr>

</table>
A.C.U.E Colegio Nuestra Señora de Lourdes                       Nro. de Control
Inscrito en el M.P.P.E. Cod.S0207D0814           Fecha          ${numeroControl}
Número de RIF: J-31730846-8                     ${fecha}            Factura
AV(100) Bolivar Norte. Valencia-Carabobo                          ${numFactura}

Razón Social: ${razonSocial}                      CI/RIF: ${cidRif}
Dirección: ${direccion}                           Teléfono: ${telefono}
----------------------------------------------------------------------------------
                       CONCEPTO                                   BOLIVARES
----------------------------------------------------------------------------------





----------------------------------------------------------------------------------
FORMAS DE PAGO:

DETALLE DE PAGO:


----------------------------------------------------------------------------------


Conforme de recibido: _________________________________
</html>
`

    if (fs.existsSync(nombreArchivo)) {
        console.log('el archivo existe')
    } else {

        console.log('el archivo no existe')

        fs.writeFileSync(nombreArchivo, contenido)

        //forma asincrona

        // fs.writeFile(nombreArchivo, contenido, (err)=>{

        //     if (err) throw('error al crear archivo')

        //     console.log('se creo el archivo')
        // })
    }

}

facturaFile()