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
