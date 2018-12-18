module.exports = class Collection {
  constructor(dataSet) {
    this.jsonData = dataSet;
    this.mainCategories = [];
    this.subCategory = [];
    this.Animal = "";
    this.weight = null;
    this.units = "kgs";
    this.categories= [];
    this.firstCategory = "";
    this.subCategoryPage = false;
    this.drugData = [];
  }

    // Functions
    pushData(_data, _JSONdetails) {
      let detailsForPassing = {
        drugName: _data,
        drugDetails: _JSONdetails
      };
      // Create Array of {drugName: drugsDetails: } for sending to drug-list
      this.drugData.push(detailsForPassing);
    }
    setWeightAndUnits (weight, units){
      // Set weight and units in passData
      this.weight = weight;
      this.units = units;
    }
    getCategories(json) {
      let categories = [];
      for (let category in json) {
        categories.push(category);
      }
      this.categories = categories;
    }
    getSubcategories(category) {

      let subCategory = [];

      if (subCategory.length == 0) {
        const subJSON = this.jsonData[category];
        for (let sub in subJSON) {
          subCategory.push(sub);
        }
      }
      this.categories = subCategory;
    }
    clearData() {
      this.subCategory = [];
      this.Animal = "";
      this.firstCategory = ""
      this.weight = null;
      this.subCategoryPage = false;
      this.drugData = [];
    }
    converter(){
      let converter = 1;
      if (this.units === "lbs") {
        converter = 0.454545;
      }
      return converter;
    }
    dataPassObject() {
      return {
        categories: this.categories,
        Animal: this.Animal,
        weight: this.weight,
        units: this.units
      }
    }

    createDrugListObject(passedSub) {
      return {
      category: passedSub,
      drugs: this.drugData,
      animal: this.Animal,
      weight: this.weight,
      units: this.units,
      converter: this.converter()
      }
    }

}
