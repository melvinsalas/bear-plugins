# bear-plugins

# Reply via Email Plugin

A lightweight JavaScript plugin that adds a customizable **"Reply via email"** link to your blog posts

## Parameters

|              | Required | Description                                       | Default         |
|--------------|----------|---------------------------------------------------|-----------------|
| `data-email` | Yes      | Email address used to generate the `mailto:` link | —               |
| `data-text`  | No       | Text displayed on the email link                  | Reply via email |

## Usage

```html
<script 
  src="https://cdn.jsdelivr.net/gh/melvinsalas/bear-plugins/plugins/reply.js"
  data-email="contact@example.com"
  data-text="Reply via email">
</script>
```

## Output

The plugin generates a simple div containing the email link:

```html
<div class="reply-via-email-wrapper">
    <a class="reply-via-email" 
        href="mailto:contact@example.com?subject=Re:Title">
        Reply via email
    </a>
</div>
```

You can freely style both the wrapper and the link in your own stylesheet

```css
.reply-via-email-wrapper { margin-top: 1.25rem; }
.reply-via-email {
    display: inline-block;
    padding: .25rem .75rem;
    border: 1px solid currentColor;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
}
.reply-via-email:hover { filter: brightness(0.5); }
```