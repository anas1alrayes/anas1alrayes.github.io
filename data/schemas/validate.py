import json
import os
import sys
import jsonschema

# Mapping from JSON file to its JSON Schema file
VALIDATION_MAPS = [
    ("data/site.json", "data/schemas/site.schema.json"),
    ("data/projects/index.json", "data/schemas/project-index.schema.json"),
    ("data/projects/filefusion.json", "data/schemas/project.schema.json"),
    ("data/projects/shorker.json", "data/schemas/project.schema.json"),
    ("data/projects/salatapp.json", "data/schemas/project.schema.json"),
    ("data/achievements.json", "data/schemas/achievements.schema.json"),
    ("data/skills.json", "data/schemas/skills.schema.json"),
    ("data/documents.json", "data/schemas/documents.schema.json"),
    ("data/i18n/en.json", "data/schemas/i18n.schema.json"),
    ("data/i18n/ar.json", "data/schemas/i18n.schema.json")
]

def run_validation():
    print("=== Starting Schema Validation CLI ===")
    errors_found = False
    
    for json_path, schema_path in VALIDATION_MAPS:
        if not os.path.exists(json_path):
            print(f"[ERROR] JSON File not found: {json_path}")
            errors_found = True
            continue
            
        if not os.path.exists(schema_path):
            print(f"[ERROR] Schema File not found: {schema_path}")
            errors_found = True
            continue
            
        try:
            with open(json_path, "r", encoding="utf-8") as jf:
                data = json.load(jf)
            with open(schema_path, "r", encoding="utf-8") as sf:
                schema = json.load(sf)
                
            jsonschema.validate(instance=data, schema=schema)
            print(f"[PASS] {json_path} matches {schema_path}")
        except json.JSONDecodeError as jde:
            print(f"[FAIL] {json_path} could not be parsed as valid JSON: {jde}")
            errors_found = True
        except jsonschema.exceptions.ValidationError as ve:
            print(f"[FAIL] {json_path} validation failed against {schema_path}")
            print(f"       Reason: {ve.message}")
            print(f"       Path: {list(ve.absolute_path)}")
            errors_found = True
        except Exception as e:
            print(f"[FAIL] Unexpected error validating {json_path}: {e}")
            errors_found = True
            
    print("=======================================")
    if errors_found:
        print("[STATUS] Validation FAILED.")
        sys.exit(1)
    else:
        print("[STATUS] All schemas are 100% VALID.")
        sys.exit(0)

if __name__ == "__main__":
    run_validation()
