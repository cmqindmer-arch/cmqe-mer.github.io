import 'package:metier_mer_to_json/entreprises.dart';
import 'package:metier_mer_to_json/excel.dart';
import 'package:metier_mer_to_json/formations.dart';
import 'package:metier_mer_to_json/metiers.dart';
import 'package:metier_mer_to_json/relations.dart';
import 'dart:io';
import 'package:metier_mer_to_json/store_json.dart';
import 'package:excel/excel.dart';

void main() async {
  //Get xlsx dir
  final currDir = Directory("./xlsx");
  // Get the first file in there that starts with .xlsx
  final xlsxFileEntry = await currDir.list().firstWhere(
    (entry) => entry.path.endsWith(".xlsx"),
  );
  //Read the content of the file
  final input = await File(xlsxFileEntry.path).readAsBytes();
  // Parse excel
  final excel = Excel.decodeBytes(input);
  // Get all the sheets
  final sheets = excel.sheets;

  // Get the wanted sheets and convert them to csv
  final metierCsv = sheets["Métiers"]!.toCsv();
  final formationsCsv = sheets["Formations"]!.toCsv();

  // Unused for new version, entreprises are determined from metiers
  // final entreprisesCsv = sheets["Entreprises"]!.toCsv();

  // Tranform the csv to json
  final metierJson = MetiersConverter().convertCsvToJson(metierCsv);
  final formationsJson = FormationsConverter().convertCsvToJson(formationsCsv);

  // Unused for new version
  // final entreprisesJson = EntreprisesConverter().convertCsvToJson(
  //   entreprisesCsv,
  // );
  final entreprisesJson = entreprisesFromMetier(metierJson: metierJson);

  // Generate the relations
  final relationsJson = generateRelations(
    metierJson: metierJson,
    formationsJson: formationsJson,
    entreprisesJson: entreprisesJson
  );

  // Store json to the file system
  await storeJson("json/metiers.json", metierJson);
  await storeJson("json/formations.json", formationsJson);
  await storeJson("json/entreprises.json", entreprisesJson);
  await storeJson("json/relations.json", relationsJson);
}
