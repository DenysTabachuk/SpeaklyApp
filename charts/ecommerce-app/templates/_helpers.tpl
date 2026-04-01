{{- define "ecommerce-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ecommerce-app.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "ecommerce-app.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "ecommerce-app.labels" -}}
app.kubernetes.io/name: {{ include "ecommerce-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end -}}

{{- define "ecommerce-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ecommerce-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "ecommerce-app.configMapName" -}}
{{- printf "%s-config" (include "ecommerce-app.fullname" .) -}}
{{- end -}}

{{- define "ecommerce-app.secretName" -}}
{{- printf "%s-secret" (include "ecommerce-app.fullname" .) -}}
{{- end -}}

{{- define "ecommerce-app.postgresName" -}}
{{- printf "%s-postgres" (include "ecommerce-app.fullname" .) -}}
{{- end -}}
