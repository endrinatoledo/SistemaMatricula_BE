const { StatusCodes } = require('http-status-codes')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require("../models");

const CostoMesualidadesModel = db.costoMesualidadesModel

//Add exchangeRate

const addCostoMensualidad = async (req, res, next) => {

    if (req.body.cmeAmount === '') return res.status(406).json({ ok: false, message: 'Todos los campos son obligatorios' });
    try {
        CostoMesualidadesModel.create({
            cmeAmount: (parseFloat(req.body.cmeAmount)).toFixed(2),
            cmeDate: new Date().toISOString().split('T')[0]
        })
            .then((costoMensualidad) => {
                message = 'Costo de mensualidad creada con éxito';
                res.status(StatusCodes.OK).json({ ok: true, data: costoMensualidad, message })
            }, (err) => {
                message = err
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message })
                next(err)
            })


    } catch (err) {
        message = err;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message });
        next(err);
    }

}
//get All exchangeRate
const getAllCostoMensualidades = async (req, res, next) => {

    CostoMesualidadesModel.findAll({
        order: [['cme_id', 'DESC']],
    })
        .then((costoMensualidades) => {
            res.status(StatusCodes.OK).json({ ok: true, data: costoMensualidades })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })

}
//get All exchangeRate by Id
const getOneCostoMensualidadById = async (req, res, next) => {

    CostoMesualidadesModel.findOne({
        where: {
            cmeId: req.params.cmeId
        }
    })
        .then((costoMensualidad) => {
            res.status(StatusCodes.OK).json({ ok: true, data: costoMensualidad })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })

}

//Delete exchangeRate
const deleteCostoMensualidad = async (req, res, next) => {

    CostoMesualidadesModel.destroy({
        where: {
            cmeId: req.params.cmeId
        }
    }).then((rowsDeleted) => {
        if (rowsDeleted > 0) {
            return res.status(StatusCodes.OK).json({ ok: true, message: `Costo mensualidad eliminada con éxito` })
        } else {
            return res.status(StatusCodes.OK).json({ ok: false, message: `Error al eliminar Costo mensualidad` })
        }
    }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
        next(err)
    })

}

const latestCostoMensualidad = async (req, res, next) => {
    CostoMesualidadesModel.findOne({
        order: [['cme_id', 'DESC']],
        limit: 1,
    })
        .then((costoMensualidad) => {
            res.status(StatusCodes.OK).json({ ok: true, data: costoMensualidad })
        }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ok: false, message })
            next(err)
        })
}

module.exports = {
    addCostoMensualidad,
    getAllCostoMensualidades,
    getOneCostoMensualidadById,
    deleteCostoMensualidad,
    latestCostoMensualidad,
}
