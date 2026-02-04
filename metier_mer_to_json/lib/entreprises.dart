import 'package:metier_mer_to_json/csv_to_json.dart';

// A converter with the rules for metier
class EntreprisesConverter extends CsvToJsonConverter {
  @override
  String get identifierChar => "E";

  @override
  String mapKey(String oldKey) {
    return switch (oldKey) {
      "Nom de l'entreprise" => "nom",
      "Activités" => "activites",
      "Localisation" => "localisation",
      "Lien du site internet" => "site",
      _ => throw Exception("Unkwon row name : $oldKey"),
    };
  }
}

List<Map<String, dynamic>> entreprisesFromMetier({
  required List<Map<String, dynamic>> metierJson,
}) {
  final entreprisesNames = metierJson
      .expand(
        (m) => (m["entreprises"] as String).split(",").map((e) => e.trim()),
      )
      .toSet();
  return entreprisesNames.indexed
      .map(
        (indexN) => {
          "id": "E${(indexN.$1 + 1).toString().padLeft(3, "0")}",
          "nom": indexN.$2,
          "activites": "",
          "localisation": "",
          "site": "",
        },
      )
      .toList();
}
