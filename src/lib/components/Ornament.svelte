<script lang="ts">
	/**
	 * The diamond sits inside the "O" of the wordmark. Borrowed here as the
	 * site's one piece of ornament, flanked by hairlines like a poster divider.
	 */
	type Props = { width?: string };
	let { width = '11rem' }: Props = $props();
</script>

<div class="ornament" style:--w={width} aria-hidden="true">
	<span class="line"></span>
	<span class="diamond"></span>
	<span class="line"></span>
</div>

<style>
	.ornament {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		width: var(--w);
		max-width: 60%;
		margin-inline: auto;
	}

	.line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--hairline-strong));
	}

	.line:last-child {
		background: linear-gradient(90deg, var(--hairline-strong), transparent);
	}

	.diamond {
		width: 5px;
		height: 5px;
		rotate: 45deg;
		background: var(--silver-dim);
	}
</style>
