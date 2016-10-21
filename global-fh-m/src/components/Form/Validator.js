const varReg = /^\{([^\{}].*)\}$/

export default class Validator {

  constructor (options) {
    this.form = options.form
    this.fieldConfig = options.fieldConfig
    this.formControlContainer = options.formControlContainer
    this.errorMsgContainer = options.errorMsgContainer

    this.validationMap = {}

    this.strategies = this.initStrategy()

    this.addValidators()

    this.data = {}
  }

  getRealValue (fakeValue) {
    let itIsVar = fakeValue.match(varReg)
    return itIsVar ? (this.data[itIsVar[1]]) : fakeValue
  }

  initStrategy () {
    return {
      required (value) {
        return !!value
      },

      isNumber (value) {
        return /^\d+$/.test(value)
      },

      equalTo (value, target) {
        return value === target
      },

      pattern (value, pattern) {
        if(value!=='' && value!==undefined){
          return new RegExp(pattern).test(value)
        }
        return true;
      },

      minLength (value, length) {
        return value.replace(/[\u4e00-\u9fa5]/g, '**').length >= Number(length)
      },

      maxLength (value, length) {
        return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= Number(length)
      },

      maxValue (value, target) {
        return Number(value) <= target
      },

      notEqualTo (value, target) {
        return value !== target
      },

      minValue (value, min) {
        return Number(value) >= Number(min)
      },
      noSpecialChar (value) {
        var myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
        return !myReg.test(value);
      },
      notIsNumAndLessThen9 (value) {
        var myReg = /^\d{0,8}$/;
        return !myReg.test(value);
      },
      noSpaceChar(value){
        var myReg = /[\ ]/;
        return !myReg.test(value);
      },
      oneDecimal(val){
        var myReg = /^(0|[1-9][0-9]*)(.\d{1})?$/;
        return myReg.test(value);
      }
    }
  }

  addStrategy (name, func) {
    this.strategies[name] = func
  }

  verifyValidators (name, strategies) {
    let isFieldValid = true
    strategies.map(func => {
      isFieldValid = isFieldValid && func()
    })

    let $controlContainer = $(this.form[name]).closest(this.formControlContainer)
    if (!isFieldValid) {
      $controlContainer.addClass('has-error').find(this.errorMsgContainer).slideDown()
    } else {
      $controlContainer.removeClass('has-error').find(this.errorMsgContainer).slideUp()
    }

    return isFieldValid
  }

  addValidators () {
    this.fieldConfig.map(item => {
      item.name && (this.addValidator(item.name, item.validation))
      if ('group' === item.type) {
        item.items.map(item => {
          item.name && (this.addValidator(item.name, item.validation))
        })
      }
    })
  }

  addValidator (name, validation = { rules: []}) {
    let { rules } = validation

    let domValidations = []

    rules.map(rule => {
      domValidations.push(() => {
        let strategyArg = rule.split('::')

        if (strategyArg[1]) {
          strategyArg[1] = this.getRealValue(strategyArg[1])
        }

        let strategy = strategyArg.shift()
        strategyArg.unshift(this.form[name].value)

        return this.strategies[strategy].apply(this, strategyArg)
      })
    })

    this.validationMap[name] = () => {
      return this.verifyValidators(name, domValidations)
    }
  }

  check (fieldName) {
    let isValid = true

    if (fieldName) {
      return this.validationMap[fieldName]()
    } else {
      for (var field in this.validationMap) {
        isValid = this.validationMap[field]() && isValid
      }
    }

    return isValid
  }

  setData (name, value) {
    if ('object' === typeof name) {
      this.data = name
    } else {
      this.data[name] = value
    }
  }
}