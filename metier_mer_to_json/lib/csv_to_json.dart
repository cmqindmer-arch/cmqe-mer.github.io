import 'dart:typed_data';

import 'package:csv/csv.dart';
import 'package:enough_convert/enough_convert.dart';

/// Decodes a csv content (that could come from a file) and convert it to a List containing
/// all the elements in a row.
List<List<dynamic>> rawCsvDecode(Uint8List rawCsv) {
  final codec = const Windows1252Codec();
  final decoded = codec.decode(rawCsv);
  return CsvToListConverter().convert(decoded);
}

List<List<dynamic>> stringCsvDecode(String csv) {
  return CsvToListConverter().convert(csv);
}

/// Convert a parsed csv content (obtained through `csvDecode()`)
/// and maps it to the json equivalent.
/// The first row will define the keys of each json object.
/// All the other rows will generate the output where each objects will have it's
/// value associated with the key of the same index.
List<Map<String, dynamic>> csvToJson(List<List<dynamic>> csv) {
  final json = <Map<String, dynamic>>[];
  // get keys
  final keys = csv[0].map((e) => e.toString()).toList();
  final keysIndex = csv[0].indexed
      .where((e) => e.$2.toString().isNotEmpty)
      .map((e) => e.$1)
      .toList();

  for (final row in csv.skip(1)) {
    final current = <String, dynamic>{};
    for (final index in keysIndex) {
      current[keys[index]] = row[index];
    }
    json.add(current);
  }

  return json;
}

/// Class that convert a csv byte stream to json.
/// This class is meant to be extended.
/// You'll have to implement the `mapKey()` that matchs
/// the original rows in the csv to the keys in the json
/// as well as the `identifierChar` getter witch will add the id primary
/// key in the json.
/// Let's say you implements the `identifierChar` this way:
/// ```dart
/// @override
/// String get identifierChar => "P";
/// ```
/// Then each json object will have the follow key/value pair:
/// ```json
/// "id" : "P001"
/// ```
///
/// Where the number after 'P' will be index + 1, with padding
/// such as the number is always 3 chars long.
///
/// All the other needed methods are already defined for you.
///
/// to convert rawCsv to json with the defined rules,just call `rawCsvToJson`.
abstract class CsvToJsonConverter {
  String get identifierChar;

  String mapKey(String oldKey);

  List<Map<String, dynamic>> updateObjectListKeys(
    List<Map<String, dynamic>> json,
  ) {
    final out = <Map<String, dynamic>>[];
    for (final (index, jsonElem) in json.indexed) {
      out.add(_updateObjectKeys(jsonElem, index + 1));
    }
    return out;
  }

  List<Map<String, dynamic>> convertRawCsvToJson(Uint8List rawCsv) {
    final parsedCsv = rawCsvDecode(rawCsv);
    final rawJson = csvToJson(parsedCsv);
    return updateObjectListKeys(rawJson);
  }

  List<Map<String, dynamic>> convertCsvToJson(List<List<dynamic>> csv) {
    final rawJson = csvToJson(csv);
    return updateObjectListKeys(rawJson);
  }

  Map<String, dynamic> _updateObjectKeys(Map<String, dynamic> json, id) {
    final output = {"id": "$identifierChar${id.toString().padLeft(3, "0")}"};
    for (final MapEntry(:key, :value) in json.entries) {
      output[mapKey(key)] = value;
    }
    return output;
  }
}
