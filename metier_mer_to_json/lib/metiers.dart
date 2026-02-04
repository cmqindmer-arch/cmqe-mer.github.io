import 'package:metier_mer_to_json/csv_to_json.dart';

// A converter with the rules for metier
class MetiersConverter extends CsvToJsonConverter {
  @override
  String get identifierChar => "M";

  @override
  String mapKey(String oldKey) {
    return switch (oldKey) {
      "Métier" => "nom",
      "Secteur" => "secteur",
      "Formation" => "formation",
      "Entreprise(s)" => "entreprises",
      _ => throw Exception("Unkwon row name : $oldKey"),
    };
  }

  // @override
  // List<Map<String, dynamic>> convertCsvToJson(List<List<dynamic>> csv) {
  //   final oldJsonList = super.convertCsvToJson(csv);
  //   final newJsonList = <Map<String, dynamic>>[];
  //   for (final oldJson in oldJsonList) {
  //     // Make formation be a list rather than a string
  //     final oldJsonFormation = oldJson["formation"]! as String;
  //     final newJsonFormation = oldJsonFormation
  //         .split(",")
  //         .map((f) => f.trim())
  //         .toList();

  //     // Make entreprises be a list rather than a string
  //     final oldJsonEntreprises = oldJson["entreprises"]! as String;
  //     final newJsonEntreprises = oldJsonEntreprises
  //         .split(",")
  //         .map((f) => f.trim())
  //         .toList();

  //     final newJson = <String, dynamic>{
  //       "id": oldJson["id"]!,
  //       "nom": oldJson["nom"]!,
  //       "secteur": oldJson["secteur"],
  //       "formation": newJsonFormation,
  //       "entreprises": newJsonEntreprises,
  //     };

  //     newJsonList.add(newJson);
  //   }

  //   return newJsonList;
  // }
}
