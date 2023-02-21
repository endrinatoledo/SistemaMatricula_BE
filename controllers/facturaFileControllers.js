// requires
const fs = require("fs");
const PDFDocument = require("pdfkit-table");

try {

  // init document
  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  // save document
  doc.pipe(fs.createWriteStream("document.pdf"));

  ; (async function () {
    // table 
    // const table = {

    //   title: "Title",
    //   subtitle: "Subtitle",
    //   headers: ["Country", "Conversion rate", "Trend"],
    //   rows: [
    //     ["Switzerland", "12%", "+1.12%"],
    //     ["France", "67%", "-0.98%"],
    //     ["England", "33%", "+4.44%"],
    //   ],
    // };
    // // A4 595.28 x 841.89 (portrait) (about width sizes)
    // // width
    // await doc.table(table, {
    //   width: 300,
    // });
    // // or columnsSize
    // await doc.table(table, {
    //   columnsSize: [200, 100, 100],
    // });
    // done!

    // const table = {
    //   title: "Title",
    //   subtitle: "Subtitle",
    //   headers: [
    //     { label: "Name", property: 'name', width: 60, renderer: null },
    //     { label: "Description", property: 'description', width: 150, renderer: null },
    //     { label: "Price 1", property: 'price1', width: 100, renderer: null },
    //     { label: "Price 2", property: 'price2', width: 100, renderer: null },
    //     { label: "Price 3", property: 'price3', width: 80, renderer: null },
    //     {
    //       label: "Price 4", property: 'price4', width: 43,
    //       renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return `U$ ${Number(value).toFixed(2)}` }
    //     },
    //   ],
    //   // complex data
    //   datas: [
    //     {
    //       name: 'Name 1',
    //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ',
    //       price1: '$1',
    //       price3: '$ 3',
    //       price2: '$2',
    //       price4: '4',
    //     },
    //     {
    //       options: { fontSize: 10, separation: true },
    //       name: 'bold:Name 2',
    //       description: 'bold:Lorem ipsum dolor.',
    //       price1: 'bold:$1',
    //       price3: {
    //         label: 'PRICE $3', options: { fontSize: 12 }
    //       },
    //       price2: '$2',
    //       price4: '4',
    //     },
    //     // {...},
    //   ],
    //   // simeple data
    //   rows: [
    //     [
    //       "Apple",
    //       "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
    //       "$ 105,99",
    //       "$ 105,99",
    //       "$ 105,99",
    //       "105.99",
    //     ],
    //     // [...],
    //   ],
    // };
    // // the magic
    // doc.table(table, {
    //   prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
    //   prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
    //     doc.font("Helvetica").fontSize(8);
    //     indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
    //   },
    // });

    const table2 = {
      // layout: 'headerLineOnly',
      title: "",
      subtitle: "",
      headers: ["", "", ""],
      
      // widths: ['*', 'auto', 100, '*'],
      // noborders: true,
      // defaultStyle: {
      //   // fontSize: 15,
      //   bold: true
      // },
      // columns:[
      //   { width: '*', text: 'primera column' },
      //   { width: '10', text: 'Second column' },
      //   { width: '10', text: 'tercera column' },
      // ],
      rows: [
        ["A.C.U.E Colegio Nuestra Señora de Lourdes", " ", "Nro. de Control"],
        ["Inscrito en el M.P.P.E. Cod.S0207D0814", "Fecha", "236569656"],
        ["Número de RIF: J-31730846-8", "02/03/2023", "Factura"],
        ["AV(100) Bolivar Norte. Valencia-Carabobo", " ", "569856966569"],
        [" "],
        ["-----------------------------------------------------------------------------------------------"],
      ],
    }
    var tableOptions = {
      // noVerticalLines: true,
      // layout: 'noBorders',
      divider: {
        header: { disabled: true },
        horizontal: { disabled: true },
      },
      hideHeader: true,
      columnsSize: [350, 100, 100],
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => doc.font("Helvetica").fontSize(10),
    }

    await doc.table(table2, tableOptions);
    doc.end();
  })();

  // A.C.U.E Colegio Nuestra Señora de Lourdes                       Nro. de Control
// Inscrito en el M.P.P.E. Cod.S0207D0814           Fecha          ${numeroControl}
// Número de RIF: J-31730846-8                     ${fecha}            Factura
// AV(100) Bolivar Norte. Valencia-Carabobo                          ${numFactura}

} catch (error) {
  console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrro', error)
}






// ****************************************************************************************************************************

// const pdfdocument = require('pdfkit');
// const fs = require('fs');
// const pdftable = require('voilab-pdf-table')




// try {
// const pdf = new pdfdocument({
//   autoFirstPage:false
// }),
// table = new pdftable(pdf, {
//   bottomMargin:30
// })

// table 
//       .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
//         column: 'description'
//       }))
//   .setColumnsDefaults({
//     headerBorder: 'B',
//     align: 'right'
//   })
//   .addColumns([
//         {
//           id: 'description',
//           header: 'Product',
//           align: 'left'
//         },
//         {
//           id: 'quantity',
//           header: 'Quantity',
//           width: 50
//         },
//         {
//           id: 'price',
//           header: 'Price',
//           width: 40
//         },
//         {
//           id: 'total',
//           header: 'Total',
//           width: 70,
//           renderer: function (tb, data) {
//             return 'CHF ' + data.total;
//           }
//         }
//       ])
//       // add events (here, we draw headers on each new page)
//     // agregar eventos (aquí, dibujamos encabezados en cada página nueva)
//       .onPageAdded(function (tb) {
//         tb.addHeader();
//       });

//           pdf.addPage();

//     // draw content, by passing data to the addBody method
//     // dibujar contenido, pasando datos al método addBody
//     table.addBody([
//       { description: 'Product 1', quantity: 1, price: 20.10, total: 20.10 },
//       { description: 'Product 2', quantity: 4, price: 4.00, total: 16.00 },
//       { description: 'Product 3', quantity: 2, price: 17.85, total: 35.70 }
//     ]);



//   table2 = new pdftable(pdf, {
//     bottomMargin: 30
//   })

//   table2
//     .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
//       column: 'description'
//     }))
//     .setColumnsDefaults({
//       headerBorder: 'B',
//       align: 'right'
//     })
//     .addColumns([
//       {
//         id: 'description',
//         header: 'Product',
//         align: 'left'
//       },
//       {
//         id: 'quantity',
//         header: 'Quantity',
//         width: 50
//       },
//       {
//         id: 'price',
//         header: 'Price',
//         width: 40
//       },
//       {
//         id: 'total',
//         header: 'Total',
//         width: 70,
//         renderer: function (tb, data) {
//           return 'CHF ' + data.total;
//         }
//       }
//     ])
//     // add events (here, we draw headers on each new page)
//     // agregar eventos (aquí, dibujamos encabezados en cada página nueva)
//     .onPageAdded(function (tb) {
//       tb.addHeader();
//     });

//   pdf.addPage();

//   // draw content, by passing data to the addBody method
//   // dibujar contenido, pasando datos al método addBody
//   table2.addBody([
//     { description: 'Product 1', quantity: 1, price: 20.10, total: 20.10 },
//     { description: 'Product 2', quantity: 4, price: 4.00, total: 16.00 },
//     { description: 'Product 3', quantity: 2, price: 17.85, total: 35.70 }
//   ]);

    
// pdf.end()

// pdf.pipe(fs.createWriteStream('OUTPUT3.pdf'))

// } catch (error) {
// console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrr',error)
// }







// ****************************************************************************************************************************




























// module.exports = {
//   create: function () {
//     // create a PDF from PDFKit, and a table from PDFTable
//     var pdf = new PdfDocument({
//       autoFirstPage: false
//     }),
//       table = new PdfTable(pdf, {
//         bottomMargin: 30
//       });

//     table
//       // add some plugins (here, a 'fit-to-width' for a column)
//       .addPlugin(new (require('voilab-pdf-table/plugins/fitcolumn'))({
//         column: 'description'
//       }))
//       // set defaults to your columns
//       .setColumnsDefaults({
//         headerBorder: 'B',
//         align: 'right'
//       })
//       // add table columns
//       .addColumns([
//         {
//           id: 'description',
//           header: 'Product',
//           align: 'left'
//         },
//         {
//           id: 'quantity',
//           header: 'Quantity',
//           width: 50
//         },
//         {
//           id: 'price',
//           header: 'Price',
//           width: 40
//         },
//         {
//           id: 'total',
//           header: 'Total',
//           width: 70,
//           renderer: function (tb, data) {
//             return 'CHF ' + data.total;
//           }
//         }
//       ])
//       // add events (here, we draw headers on each new page)
//       .onPageAdded(function (tb) {
//         tb.addHeader();
//       });

//     // if no page already exists in your PDF, do not forget to add one
//     pdf.addPage();

//     // draw content, by passing data to the addBody method
//     table.addBody([
//       { description: 'Product 1', quantity: 1, price: 20.10, total: 20.10 },
//       { description: 'Product 2', quantity: 4, price: 4.00, total: 16.00 },
//       { description: 'Product 3', quantity: 2, price: 17.85, total: 35.70 }
//     ]);

//     return pdf;
//   }
// };


// function facturaFile(){
//   // Create a document
//   const doc = new PDFDocument();

//   // Pipe its output somewhere, like to a file or HTTP response
//   // See below for browser usage
//   doc.pipe(fs.createWriteStream('OUTPUT------------.pdf'));

//   doc.text('hola', {
//     align: 'center'
//   })
//   var parrafo = `ffffff`
//   doc.text(parrafo, {
//     columns: 3
//   })
//   doc.end();
//   console.log('se ejecuto')


// }


// Embed a font, set the font size, and render some text
// doc
//   .font('fonts/PalatinoBold.ttf')
//   .fontSize(25)
//   .text('Some text with an embedded font!', 100, 100);

// Add an image, constrain it to a given size, and center it vertically and horizontally
// doc.image('path/to/image.png', {
//   fit: [250, 300],
//   align: 'center',
//   valign: 'center'
// });

// Add another page
// doc
//   .addPage()
//   .fontSize(25)
//   .text('Here is some vector graphics...', 100, 100);

// Draw a triangle
// doc
//   .save()
//   .moveTo(100, 150)
//   .lineTo(100, 250)
//   .lineTo(200, 250)
//   .fill('#FF3300');

// Apply some transforms and render an SVG path with the 'even-odd' fill rule
// doc
//   .scale(0.6)
//   .translate(470, -380)
//   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
//   .fill('red', 'even-odd')
//   .restore();

// Add some text with annotations
// doc
//   .addPage()
//   .fillColor('blue')
//   .text('Here is a link!', 100, 100)
//   .underline(100, 100, 160, 27, { color: '#0000FF' })
//   .link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file


// function facturaFile(fecha = '11/12/2022', numeroControl = '00-00000173', numFactura = '00000153', razonSocial, cidRif ='v-12174610', direccion, telefono, descripcion, detalleDePago) {
 
//     const nombreArchivo = 'prueba.txt'
//     const contenido = 
// `<html>

// <table class="default">

//   <tr>

//     <td>Celda 1</td>

//     <td>Celda 2</td>

//     <td>Celda 3</td>

//   </tr>

//   <tr>

//     <td>Celda 4</td>

//     <td>Celda 5</td>

//     <td>Celda 6</td>

//   </tr>

// </table>
// A.C.U.E Colegio Nuestra Señora de Lourdes                       Nro. de Control
// Inscrito en el M.P.P.E. Cod.S0207D0814           Fecha          ${numeroControl}
// Número de RIF: J-31730846-8                     ${fecha}            Factura
// AV(100) Bolivar Norte. Valencia-Carabobo                          ${numFactura}

// Razón Social: ${razonSocial}                      CI/RIF: ${cidRif}
// Dirección: ${direccion}                           Teléfono: ${telefono}
// ----------------------------------------------------------------------------------
//                        CONCEPTO                                   BOLIVARES
// ----------------------------------------------------------------------------------





// ----------------------------------------------------------------------------------
// FORMAS DE PAGO:

// DETALLE DE PAGO:


// ----------------------------------------------------------------------------------


// Conforme de recibido: _________________________________
// </html>
// `

//     if (fs.existsSync(nombreArchivo)) {
//         console.log('el archivo existe')
//     } else {

//         console.log('el archivo no existe')

//         fs.writeFileSync(nombreArchivo, contenido)

//         //forma asincrona

//         // fs.writeFile(nombreArchivo, contenido, (err)=>{

//         //     if (err) throw('error al crear archivo')

//         //     console.log('se creo el archivo')
//         // })
//     }

// }

// facturaFile()