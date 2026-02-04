import 'dart:io';
import 'dart:convert';

/// Stores a json object list to the specified path.
/// Creates the directories if needed.
Future<void> storeJson(String path, dynamic json) async {
  final file = await File(path).create(recursive: true);
  final encodedJson = jsonEncode(json);
  await file.writeAsString(encodedJson);
}
