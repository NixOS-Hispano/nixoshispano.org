import React, { useEffect, useState, useCallback } from "react";

interface GitLabComment {
  id: number;
  body: string;
  author: {
    name: string;
    avatar_url: string;
    web_url: string;
  };
  created_at: string;
}

interface Props {
  projectId: string;
  issueSearchTerm: string;
}

const GITLAB_API = "https://gitlab.com/api/v4";

export default function GitLabComments({
  projectId = "nixoshispano/nixoshispano.org",
  issueSearchTerm,
}: Props): JSX.Element {
  const [comments, setComments] = useState<GitLabComment[]>([]);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState(false);

  const encodedProject = encodeURIComponent(projectId);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Listar issues con label "blog-comments" para evitar problemas con search
      const res = await fetch(
        `${GITLAB_API}/projects/${encodedProject}/issues?labels=blog-comments&state=opened&per_page=100`
      );

      if (!res.ok) {
        console.error("GitLab API error:", res.status, res.statusText);
        setError("No se pudieron cargar los comentarios.");
        setLoading(false);
        return;
      }

      const issues = await res.json();
      const issue = issues.find(
        (i: { title: string }) => i.title === issueSearchTerm
      );

      if (!issue) {
        setFound(false);
        setIssueUrl(
          `https://gitlab.com/${projectId}/-/issues/new?issue[title]=${encodeURIComponent(issueSearchTerm)}&issue[description]=${encodeURIComponent("Hilo de comentarios para: " + issueSearchTerm)}&issue[label_names][]=blog-comments`
        );
        setLoading(false);
        return;
      }

      setFound(true);
      setIssueUrl(issue.web_url);

      // Obtener notas (comentarios) del issue
      const notesRes = await fetch(
        `${GITLAB_API}/projects/${encodedProject}/issues/${issue.iid}/notes?sort=asc`
      );

      if (notesRes.ok) {
        const notes = await notesRes.json();
        setComments(notes.filter((n: { system: boolean }) => !n.system));
      }
    } catch (err) {
      console.error("Error al conectar con GitLab:", err);
      setError("Error al conectar con GitLab. Verifica que el proyecto sea público.");
    }
    setLoading(false);
  }, [issueSearchTerm, encodedProject, projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (loading) {
    return <div style={{ padding: "1rem", textAlign: "center" }}>Cargando comentarios...</div>;
  }

  if (error) {
    return (
      <div style={{ marginTop: "2rem", borderTop: "1px solid var(--ifm-toc-border-color)", paddingTop: "1rem" }}>
        <h2>Comentarios</h2>
        <p style={{ color: "var(--ifm-color-danger)" }}>{error}</p>
        <button className="button button--secondary" onClick={fetchComments}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem", borderTop: "1px solid var(--ifm-toc-border-color)", paddingTop: "1rem" }}>
      <h2>Comentarios</h2>

      {found && comments.length === 0 && (
        <p style={{ color: "var(--ifm-color-secondary-darkest)" }}>
          Aún no hay comentarios. ¡Sé el primero!
        </p>
      )}

      {!found && (
        <p style={{ color: "var(--ifm-color-secondary-darkest)" }}>
          No hay hilo de comentarios para este post todavía.
        </p>
      )}

      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1rem",
            padding: "0.75rem",
            borderRadius: "8px",
            backgroundColor: "var(--ifm-background-surface-color)",
            border: "1px solid var(--ifm-toc-border-color)",
          }}
        >
          <img
            src={comment.author.avatar_url}
            alt={comment.author.name}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <div>
            <div style={{ marginBottom: "0.25rem" }}>
              <a
                href={comment.author.web_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600 }}
              >
                {comment.author.name}
              </a>
              <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: "var(--ifm-color-secondary-darkest)" }}>
                {new Date(comment.created_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>{comment.body}</div>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        {issueUrl && (
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--primary"
          >
            {found ? "Comentar en GitLab" : "Abrir hilo de comentarios"}
          </a>
        )}
        {found && (
          <button className="button button--secondary" onClick={fetchComments}>
            Actualizar
          </button>
        )}
      </div>
    </div>
  );
}
