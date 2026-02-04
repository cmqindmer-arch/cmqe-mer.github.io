import 'package:excel/excel.dart';

/// Converts a sheet to a decoded csv.
extension ConvertUtils on Sheet {
  List<List<String>> toCsv() {
    return rows.map((r) {
      return r.map((e) {
        final data = e?.value;
        return data?.toString() ?? "";
      }).toList();
    }).toList();
  }
}
