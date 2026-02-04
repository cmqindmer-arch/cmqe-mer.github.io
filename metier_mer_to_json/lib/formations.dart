import 'package:metier_mer_to_json/csv_to_json.dart';

// A converter with the rules for formation
class FormationsConverter extends CsvToJsonConverter {
  @override
  String get identifierChar => "F";

  @override
  String mapKey(String oldKey) {
    return switch (oldKey) {
      "Nom de la formation" => "nom",
      "Niveau de la formation" => "niveau",
      "Établissement" => "etablissement",
      "Localisation (Ville + Département)" => "ville",
      "métiers" => "métiers",
      _ => throw Exception("Unkwon row name : $oldKey"),
    };
  }
}
