from flask_wtf import FlaskForm
from wtforms import DateField, StringField, FloatField, TimeField
from wtforms.validators import DataRequired, Length

class MovimientosForm(FlaskForm):
    crsf = False
    date = DateField("date",validators=[DataRequired()])
    time = StringField("time",validators=[DataRequired()])
    moneda_from = StringField("moneda_from",validators=[DataRequired()])
    cantidad_from = FloatField("cantidad_from",validators=[DataRequired()])
    moneda_to = StringField("moneda_to",validators=[DataRequired()])
    cantidad_to = FloatField("cantidad_to",validators=[DataRequired()])

   
def error_validadcion_form(form):
    msj_error = ""
    registros =  {
                    "date":form.date.errors , "time":form.time.errors , "moneda_from": form.moneda_from.errors , "cantidad_from":form.cantidad_from.errors , "moneda_to":form.moneda_to.errors , "moneda_to":form.moneda_to.errors , "cantidad_to.":form.cantidad_to.errors
                            }       
        
    for registro in registros:
        if registro in form.errors:
            msj_error+= f" ERROR in the field '{registro}' = {registros.get(registro)},"

    return msj_error
