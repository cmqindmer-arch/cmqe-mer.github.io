/// Generates the relation json from metier and formations json.
Map<String, dynamic> generateRelations({
  required List<Map<String, dynamic>> metierJson,
  required List<Map<String, dynamic>> formationsJson,
  required List<Map<String, dynamic>> entreprisesJson,
}) {
  final output = <String, dynamic>{};
  final formationElements = [];
  final entreprisesElements = [];

  for (final metier in metierJson) {
    // Legacy

    // find associated formations
    // for (final formationAssociatedToMetier
    //     in (metier["formation"]! as String).split(",").map((f) => f.trim())) {
    //   for (final formation in formationsJson.where(
    //     (fJson) => fJson["nom"]! == formationAssociatedToMetier,
    //   )) {
    //     formationElements.add({
    //       "metierId": metier["id"]!,
    //       "formationId": formation["id"]!,
    //     });
    //   }
    // }
    for (final entrepriseAssociatedToMetier
        in (metier["entreprises"]! as String).split(",").map((e) => e.trim())) {
      // find associated entreprises
      for (final entreprise in entreprisesJson.where(
        (eJson) => eJson["nom"]! == entrepriseAssociatedToMetier,
      )) {
        entreprisesElements.add({
          "metierId": metier["id"]!,
          "entrepriseId": entreprise["id"]!,
        });
      }
    }
  }

  for (final formation in formationsJson) {
    // All the metiers in for a given formation
    final metiersForFormation = (formation["métiers"]! as String)
        .split(",")
        .map((e) => e.trim());
    // For each metier find the corresponding entry
    for (final metierForFormation in metiersForFormation) {
      final metier = metierJson
          .where((m) => m["nom"] == metierForFormation)
          .firstOrNull;
      // If the metier is defined in it's own page add it, else ignore
      if (metier != null) {
        formationElements.add({
          "metierId": metier["id"]!,
          "formationId": formation["id"]!,
        });
      }
    }
  }
  output["metierFormation"] = formationElements;
  output["entrepriseMetier"] = entreprisesElements;
  return output;
}
