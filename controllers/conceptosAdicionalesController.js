const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const ConceptosAdicionalesModel = db.conceptosAdicionalesModel

const addConceptosAdicionales = async (body, inhId, tasa, perId) => {
    console.log('body***********************', body)
    //     conceptosAdicionales: [
    //         {
    //             validado: 'aprobado',
    //             description: null,
    //             famId: null,
    //             famName: null,
    //             stuId: null,
    //             student: null,
    //             icoId: 1,
    //             icoName: 'SEGURO ESCOLAR',
    //             costoBol: '140.05',
    //             costoDol: 5,
    //             montoApagarBol: '140.05',
    //             montoApagarDol: 5,
    //             id: 'id3'
    //         }
    //     ]
    // } 
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().slice(0, 10);
    let arrayRespuestas = []
    try {
        for (let index = 0; index < body.length; index++) {

            arrayRespuestas.push(await ConceptosAdicionalesModel.create({
                icoId: body[index].icoId,
                icoName: body[index].icoName,
                cadDescription: body[index].description,
                inhId: inhId,
                famId: body[index].famId,
                famName: body[index].famName,
                cadCreationDate: fechaISO,
                cadUpdateDate: fechaISO,
                cadCostoDolares: body[index].costoDol,
                cadCostoBolivares: body[index].costoBol,
                cadMontoPagadoDolares: body[index].montoApagarDol,
                cadMontoPagadoBolivares: body[index].montoApagarBol,
                stuId: body[index].stuId,
                cadNameStudent: body[index].student,
                perId: perId,
                cadStatus: body[index].costoDol == body[index].montoApagarDol ? 1 : 2,
                cadtasa: tasa != null && tasa != undefined ? tasa.excAmount : null,
                excId: tasa != null && tasa != undefined ? tasa.excId : null,

                // indDescripcion: `${body[index].icoName ? body[index].icoName.toUpperCase() : ''} ${body[index].famName ? body[index].famName.toUpperCase() : ''} ${body[index].student ? body[index].student.toUpperCase() : ''} ${body[index].description ? body[index].description.toUpperCase() : ''}`,
                // indcosto: body[index].costoDol,
                // indpagado: parseFloat(body[index].montoApagarDol), //ajustar logica al aplicar pago
                // inhId: inhId,
                // indtasa: tasa != null && tasa != undefined ? tasa.excAmount : null,
                // excId: tasa != null && tasa != undefined ? tasa.excId : null,
                // indMontoAgregadoDol: body[index].montoApagarDol,
                // indMontoAgregadoBol: body[index].montoApagarBol

            })
                .then(async (res) => {
                    console.log('res CA...........**.............', res)
                    message = 'CA registrado satisfactoriamente';
                    return { ok: true, data: res, message }

                }, (err) => {
                    console.log('err.......................................63', JSON.stringify(err))
                    messageRes = `Error al cargar CA ${body[index].icoName}`;
                    return { ok: false, messge: messageRes }
                }))
        }

    } catch (err) {
        console.log('error al guardar factura', err)
        return { ok: false, message: 'error al guardar detalle CA de factura' }
    }
    return arrayRespuestas

    // try {        
    //     await ConceptosAdicionalesModel.create({
    //         icoId: data.icoId,
    //         icoName: data.icoName,
    //         cadDescription: data.cadDescription,
    //         inhId: data.inhId,
    //         famId: data.famId,
    //         famName: data.famName,
    //         cadCreationDate: data.cadCreationDate,
    //         cadUpdateDate: data.cadUpdateDate,
    //         cadCostoDolares: data.cadCostoDolares,
    //         cadCostoBolivares: data.cadCostoBolivares,
    //         cadMontoPagadoDolares: data.cadMontoPagadoDolares,
    //         cadMontoPagadoBolivares: data.cadMontoPagadoBolivares,
    //         stuId: data.stuId,
    //         cadNameStudent: data.cadNameStudent,
    //         perId: data.perId
    // }).then(data => {
    //     res.status(StatusCodes.CREATED).json({ ok: true, data });
    // }).catch(err => {
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, err });
    // });

    // } catch (error) {
    //     message = err;
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
    //     next(err);
    // }
}

const getConceptosAdicionalesByPerIdFamId = async (req, res, next) => {
    try {
        ConceptosAdicionalesModel.findAll({
            where: {
                famId: req.params.famId
            }
        }).then(data => {
            res.status(StatusCodes.OK).json({ ok: true, data });
        }).catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, err });
        });
    } catch (error) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }
}

const getConceptosAdicionalesByInhId = async (req, res, next) => {

    try {
        ConceptosAdicionalesModel.findAll({
            where: {
                inhId: req.params.inhId
            }
        }).then(data => {
            res.status(StatusCodes.OK).json({ ok: true, data });
        }).catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, err });
        });
    } catch (error) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }
}

module.exports = {
    addConceptosAdicionales,
    getConceptosAdicionalesByInhId,
    getConceptosAdicionalesByPerIdFamId
}