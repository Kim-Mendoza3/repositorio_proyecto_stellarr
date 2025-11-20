# 📝 Instrucciones: Crear el Pull Request

## ✅ Tu rama está lista!

La rama `feature/soroban-contract-review` ha sido subida con todos los cambios.

---

## 🔗 Pasos para Crear el PR

### Opción 1: Desde GitHub (Recomendado)

1. **Ve a tu repositorio:**
   https://github.com/Kim-Mendoza3/Repositorio_Proyecto_Stellar

2. **GitHub mostrará automáticamente un banner** con:
   ```
   🔔 "feature/soroban-contract-review had recent pushes"
   [Compare & pull request]
   ```

3. **Haz click en "Compare & pull request"**

4. **Completa el formulario:**

   **Title:**
   ```
   feat: Contratos inteligentes para paquetes de viaje con liberación automática de fondos
   ```

   **Description:** (Copia y pega esto)
   ```markdown
   ## 📋 Descripción
   Este PR introduce contratos inteligentes Soroban para la gestión de paquetes de viaje 
   y liberación automática de fondos basada en scoring crediticio.

   ## ✨ Qué se incluye
   - ✅ TravelPackageContract: Contrato principal con todas las funciones
   - ✅ Gestión automática de fondos (pool)
   - ✅ Validaciones: score crediticio, elegibilidad, capacidad
   - ✅ Sistema de auditoría completo
   - ✅ Integración con frontend (React Hook)
   - ✅ Documentación y ejemplos de uso

   ## 📁 Archivos
   - `contract/src/travel_package_contract.rs` (550+ líneas)
   - `contract/src/travel_package_types.rs` (tipos de datos)
   - `contract/src/travel_package_examples.rs` (7 ejemplos)
   - `frontend/src/lib/travel-package-service.ts` (integración)
   - `TRAVEL-PACKAGE-CONTRACT.md` (documentación)
   - `contract/src/lib.rs` (módulos)

   ## 🔄 Flujo
   1. Estudiante elige paquete
   2. Se validan requisitos
   3. Se libera dinero automáticamente
   4. Se registra en blockchain

   ## ✅ Checklist
   - [ ] Revisé la lógica del contrato
   - [ ] Validé las transacciones
   - [ ] Revisé la seguridad
   - [ ] Apruebo los cambios
   ```

5. **Configura los Revisores:**
   - Click en "Reviewers" 
   - Agrega a todos los integrantes del equipo

6. **Crea el PR:**
   - Click en "Create pull request"

---

### Opción 2: Desde la Línea de Comandos

```bash
# Si usas GitHub CLI (recomendado)
gh pr create \
  --title "feat: Contratos inteligentes para paquetes de viaje" \
  --body "Ver SOROBAN/proyecto-viajes-de-estudio/PR-SUMMARY.md" \
  --base main \
  --head feature/soroban-contract-review \
  --reviewer @usuario1 @usuario2 @usuario3
```

---

## 🔐 Requisitos de Revisión (Opcional)

Si quieres que **TODOS deben aprobar antes de fusionar:**

1. Ve a Settings → Branches
2. Busca "Branch protection rules"
3. Haz click en "main"
4. Marca: "Require pull request reviews before merging"
5. Marca: "Dismiss stale pull request approvals"
6. Guardas cambios

---

## ✍️ Proceso de Firma Digital

Una vez creado el PR:

1. **Tu equipo recibe notificación** 📬
2. **Cada miembro:**
   - Revisa los cambios
   - Deja comentarios (si hay dudas)
   - Click en "Approve" ✅
3. **GitHub registra automáticamente:**
   - Quién aprobó
   - Cuándo aprobó
   - Qué revisó

4. **Una vez todos aprueben:**
   - Puedes hacer "Merge pull request"
   - Los cambios van a `main`
   - Se cierra el PR automáticamente

---

## 📊 Ver el Progreso

**Mientras se revisa el PR:**

```
https://github.com/Kim-Mendoza3/Repositorio_Proyecto_Stellar/pulls
```

Verás:
- 🟢 PR abierto
- 👤 Revisores asignados
- ✅ Aprobaciones
- 💬 Comentarios
- 📝 Cambios (5 archivos nuevos, 1 modificado)

---

## 💡 Consejos

### Para Comunicar con tu Equipo:

**Email / Slack:**
```
Hola equipo,

He subido un PR para revisar los nuevos contratos de paquetes de viaje.

📌 Detalles:
- Rama: feature/soroban-contract-review
- Cambios: 1,746 líneas de código nuevo
- Archivos: 5 nuevos, 1 modificado

👉 Revisar aquí:
https://github.com/Kim-Mendoza3/Repositorio_Proyecto_Stellar/pull/[NUMBER]

📖 Documentación:
- PR-SUMMARY.md (resumen rápido)
- TRAVEL-PACKAGE-CONTRACT.md (detalles técnicos)

Por favor, revisen y aprueben cuando hayan completado la revisión.

Gracias!
```

### Para Resolver Conflictos (si los hay):

Si alguien hace cambios a `main` mientras revisan tu PR:

```bash
# Actualizar tu rama
git fetch origin
git merge origin/main

# Si hay conflictos, resolverlos y push
git add .
git commit -m "Resolver conflictos con main"
git push origin feature/soroban-contract-review
```

---

## 🚨 Troubleshooting

**Problema:** No aparece el botón "Compare & pull request"
```
→ Espera 30 segundos después del push
→ Refresca la página (F5)
→ O ve a: /pull/new/feature/soroban-contract-review
```

**Problema:** GitHub dice que la rama tiene conflictos
```
→ Actualiza la rama: git merge origin/main
→ Resuelve conflictos manualmente
→ Push nuevamente
```

**Problema:** Quiero agregar más cambios al PR
```
→ Solo haz commit en la rama feature/soroban-contract-review
→ Git push
→ Los cambios se agregan automáticamente al PR
```

---

## ✅ Resumen

| Paso | Acción | Estado |
|------|--------|--------|
| 1 | Crear rama | ✅ Hecho |
| 2 | Hacer commits | ✅ Hecho |
| 3 | Push a GitHub | ✅ Hecho |
| 4 | Crear PR | ⏳ **PRÓXIMO PASO** |
| 5 | Asignar revisores | ⏳ En el PR |
| 6 | Revisión del equipo | ⏳ Pendiente |
| 7 | Aprobaciones | ⏳ Pendiente |
| 8 | Merge a main | ⏳ Final |

---

## 🎯 Link Rápido

**Crear PR aquí:**
https://github.com/Kim-Mendoza3/Repositorio_Proyecto_Stellar/pull/new/feature/soroban-contract-review

---

¿Preguntas? Consulta:
- 📖 `PR-SUMMARY.md` - Resumen rápido
- 📚 `TRAVEL-PACKAGE-CONTRACT.md` - Documentación técnica
- 💻 `contract/src/travel_package_examples.rs` - Ejemplos de código

